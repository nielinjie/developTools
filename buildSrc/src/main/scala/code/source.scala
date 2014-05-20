package com.paic.code.source

import java.io.File
import com.paic.server.{OneObjectRepository, JsonRestPlan}
import scala.collection.JavaConverters._

case class SourceList(sources: List[String])

object SourceList {
  def recursiveListFiles(f: File): Array[File] = {
    val these = f.listFiles
    these ++ these.filter(_.isDirectory).flatMap(recursiveListFiles)
  }
  def fromRoots(roots:List[File]):SourceList={
    def good(file:File):Boolean = {
      !file.isDirectory && file.getName.endsWith(".java")
    }
    SourceList(roots.flatMap({
      r:File =>
        val ru=r.toURI
        recursiveListFiles(r).toList.filter(good).map({
          f:File =>
             ru.relativize(f.toURI).getPath
        })
    }))
  }
}
class Plan(sourceFiles: List[File]) extends JsonRestPlan("source", "sources", new OneObjectRepository[SourceList] {
  def obj: SourceList = {
    SourceList.fromRoots(sourceFiles)
  }
}) {
  def this(sourceFiles: java.util.List[File]) = this(sourceFiles.asScala.toList)
}