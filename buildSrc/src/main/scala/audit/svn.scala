package com.paic.developer.svn

import scala.collection.JavaConversions._


import japa.parser.JavaParser
import org.tmatesoft.svn.core.wc._
import org.tmatesoft.svn.core.internal.io.dav.DAVRepositoryFactory
import org.tmatesoft.svn.core.{SVNDepth, SVNURL}
import org.tmatesoft.svn.core.io.SVNRepositoryFactory

import java.io._
import com.paic.developer.code.Code._

import scala.io.{Codec, Source}
import scala.util.matching.Regex
import japa.parser.ast.body.{ClassOrInterfaceDeclaration, MethodDeclaration}
import scala.collection.mutable
import com.paic.developer.code.Method
import japa.parser.ast.PackageDeclaration
import org.slf4j.{LoggerFactory, Logger}
import com.paic.server.Messenger


class SVN(val userName: String, val password: String, val url: String,val workfolder:File) {
  val log: Logger = LoggerFactory.getLogger(classOf[SVN])

  lazy val authenticationManager = SVNWCUtil.createDefaultAuthenticationManager(userName, password)

  val parseURIEncodedJ: SVNURL = SVNURL.parseURIEncoded(url)
  val repository = SVNRepositoryFactory.create(parseURIEncodedJ, null)
  repository.setAuthenticationManager(authenticationManager)
  lazy val lv: Long = repository.getLatestRevision
  val options: ISVNOptions = SVNWCUtil.createDefaultOptions(true)
  //TODO when to close manager, and, should we?
  val clientManager: SVNClientManager = SVNClientManager.newInstance(options, authenticationManager)

  def lastVersion: String = {
    try {
      DAVRepositoryFactory.setup
      val parseURIEncodedJ = SVNURL.parseURIEncoded(url)
      val repository = SVNRepositoryFactory.create(parseURIEncodedJ, null)
      repository.setAuthenticationManager(authenticationManager)
      val lv: Long = repository.getLatestRevision
      return lv.toString
    }
    catch {
      case e: Exception => {
        throw new RuntimeException(e)
      }
    }
  }

  def diffStatusToString(diffStatus: SVNDiffStatus): String = {
    return diffStatus.getPath + " - " + diffStatus.getModificationType.toString
  }


  def log(string: Any):Unit = {
    log.info(string + "")
    Messenger.message(string+"")
  }

  def diff(): List[Method] = {
    log("get files...")
    val ca = care()
    ca.foreach {
      case x =>
        log(diffStatusToString(x))
    }
    log(s"${ca.size} files find.")
    log("get methods...")
    ca.flatMap {
      case x =>
        val dc = diffContent(x.getPath)
        val mes = methods(x.getPath)
        val dms = diffMethod(dc, mes)
        dms.map {
          case m =>
            Method(m._1, m._2, m._3)
        }
    }
  }

  def isSource(d: SVNDiffStatus) = {
    d.getPath.startsWith("src/java/")
  }

  def isJava(d: SVNDiffStatus) = {
    d.getFile.getName.endsWith(".java")
  }

  def isModificationType(d: SVNDiffStatus) = {
    List(SVNStatusType.STATUS_ADDED, SVNStatusType.STATUS_MODIFIED).contains(d.getModificationType)
  }

  def care(): List[SVNDiffStatus] = {
    diffFile().filter {
      case d =>
        isJava(d) && isModificationType(d) && isSource(d)
    }
  }

  def onLocalContent(path: String, fun: InputStream => Unit) = {
    val in = new FileInputStream(new File(workfolder, path))
    fun(in)
    try {
      in.close
    }
  }

  def onContent(path: String, fun: InputStream => Unit) = {

    val fileUrl: SVNURL = SVNURL.parseURIEncoded(s"${
      url
    }${
      path
    }")
    val out: ByteArrayOutputStream = new ByteArrayOutputStream

    val wcClient: SVNWCClient = clientManager.getWCClient

    wcClient.doGetFileContents(fileUrl, SVNRevision.UNDEFINED, SVNRevision.create(lv), false, out)

    val in = new ByteArrayInputStream(out.toByteArray)
    fun(in)
    try {
      out.close
    }
    try {
      in.close
    }

  }

  def diffFile(): List[SVNDiffStatus] = {
    DAVRepositoryFactory.setup
    val diffClient: SVNDiffClient = clientManager.getDiffClient
    var re: List[SVNDiffStatus] = List()
    diffClient.doDiffStatus(parseURIEncodedJ, SVNRevision.create(lv), workfolder, SVNRevision.WORKING, SVNDepth.INFINITY, true, new ISVNDiffStatusHandler {
      def handleDiffStatus(diffStatus: SVNDiffStatus) {
        re = re :+ diffStatus
      }
    })
    re
  }

  def diffContent(path: String): List[(Int, Int)] = {
    implicit val codec = Codec("utf-8")
    val diffClient: SVNDiffClient = clientManager.getDiffClient
    val generator = new DefaultSVNDiffGenerator()
    generator.setDiffOptions(new SVNDiffOptions(true, true, true))
    val byteArrayOutputStream = new ByteArrayOutputStream
    diffClient.doDiff(SVNURL.parseURIEncoded(url + path), SVNRevision.HEAD, new File(workfolder, path), SVNRevision.WORKING, false, false, byteArrayOutputStream)
    val source = Source.fromBytes(byteArrayOutputStream.toByteArray)

    source.getLines.toList.flatMap {
      case l =>
        val added = new Regex( """.*\+(\d+)\,(\d+).*""")
        if (l.startsWith("@@") && l.endsWith("@@")) {
          l match {
            case added(begin, length) => {
              if (length.toInt > 0) {
                Some((begin.toInt, begin.toInt + length.toInt - 1))
              }
              else
                None
            }
            case _ => None
          }
        }
        else
          None
    }
  }

  def methods(path: String): List[(PackageDeclaration, ClassOrInterfaceDeclaration, MethodDeclaration)] = {
    log(s"paring - ${path}")
    val me = new mutable.MutableList[(PackageDeclaration, ClassOrInterfaceDeclaration, MethodDeclaration)]()
    onLocalContent(path, {
      case inputStream =>
        val cu = JavaParser.parse(inputStream)
        cu.classOrInterfaces.foreach {
          case ci =>
            val methods = ci.methods
            me ++= (methods.map {
              case m =>
                (cu.getPackage, ci, m)
            })
        }
    })
    me.toList
  }

  def diffMethod(diffLines: List[(Int, Int)], methods: List[(PackageDeclaration, ClassOrInterfaceDeclaration, MethodDeclaration)]): List[(PackageDeclaration, ClassOrInterfaceDeclaration, MethodDeclaration)] = {
    def joined(a: (Int, Int), b: (Int, Int)): Boolean = {
      if (a._1 <= b._1) b._1 <= a._2
      else
        joined(b, a)
    }
    methods.filter {
      case md =>
        diffLines.exists {
          case x =>
            joined(x, (md._3.getBeginLine, md._3.getEndLine))
        }
    }
  }

}

case class Diff (methods:List[Method])


