package com.paic.testing

import org.json4s._
import org.json4s.Extraction.decompose
import org.json4s.native.Serialization
import org.json4s.native.Serialization.{read, write}
import com.paic.server.Repository
import java.io.File
import scala.io.{Codec, Source}

import scala.collection.JavaConverters._

object Json {
  def json(report:Report): String = {
    implicit val formats = Serialization.formats(NoTypeHints)
    write(report)
  }

  def toJValue(report:Report): JObject = {
    implicit val formats = Serialization.formats(NoTypeHints)
    decompose(report).asInstanceOf[JObject]
  }
}


class TestingRepository(val sourceFiles: List[File]) extends Repository {
  def reports:Report={
    sourceFiles.map{
      case f=>
        report(f)
    }.reduceLeft(_.merge(_))
  }

  def report(sourceFile:File): Report = {
    val lines = Source.fromFile(sourceFile)(Codec("utf-8")).getLines().toList
    Report.fromString(lines)
  }

  def query(query: Option[JObject]) = {
    query match {
      case None => List(Json.toJValue(reports))
      case _ => ???
    }
  }

  def add(obj: JObject) = {
    ???
  }

  def clear = {
    ???
  }
}
