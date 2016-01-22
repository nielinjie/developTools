package domain.dsl

import java.io.File
import java.nio.file.{FileSystems, Files, Path}

import domain.parse.{EntityParser, Preprocessor}

import scala.collection.JavaConversions._
import scala.io.{Codec, Source}

/**
  * Created by nielinjie on 1/18/16.
  */
class Builder(val root: File) {
  def eachFile(context: Context, path: File): Unit = {
    println(path)
    val input  =Source.fromFile(path)(Codec.UTF8).mkString
    println(input)
    val pre = Preprocessor.preProcess(input)
    println(pre)
    val parser = EntityParser
    val parsed = parser.parseAll(parser.domain, pre)
    println(parsed.map {
      d =>
        d.document = Document(path, root)
        context.domains = context.domains :+ d
        val comments = CommentFinder.findCommentIn(pre)
        context.comments.++=(CommentFinder.patchToDomain(comments,d))
        d
    })

  }

  def include(f:Path):Boolean ={
    f.getFileName.toString.endsWith(".entities")
  }
  def walkTree(context: Context, fn: (Context, File) => Unit) = {
    val path = FileSystems.getDefault.getPath(root.getAbsolutePath)
    Files.walk(path).iterator.foreach {
      f: Path =>
        if (!f.toFile.isDirectory && include(f)) {
          fn(context, f.toFile)
        }
    }
  }

  def build() = {
    val context = new Context
    this.walkTree(context, this.eachFile)
    context.build()
    context
  }
}







