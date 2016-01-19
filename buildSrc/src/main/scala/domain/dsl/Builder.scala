package domain.dsl

import java.io.File
import java.nio.file.{Path, Files, FileSystems}
import domain.dsl.EntitiesDSL.{QName, Entity, Domain}
import domain.dsl.Message.NameDuplicated
import domain.parse.{EntityRewritor, Preprocessor, EntityParser}

import scala.collection.mutable
import scala.io.Source

import scala.collection.JavaConversions._

/**
  * Created by nielinjie on 1/18/16.
  */
class Builder(val root: File) {
  def eachFile(context: Context, path: File): Unit = {
    val pre = Preprocessor.preProcess(Source.fromFile(path).mkString)
    val parser = EntityParser
    val parsed = parser.parseAll(parser.domain, pre)
    println(parsed.map {
      d =>
        d.document = Document(path, root)
        context.domains = context.domains :+ (d)


    })
  }

  def walkTree(context: Context, fn: (Context, File) => Unit) = {
    val path = FileSystems.getDefault.getPath(root.getAbsolutePath)
    Files.walk(path).iterator.foreach {
      f: Path =>
        if (!f.toFile.isDirectory) {
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







