package com.paic.testing

import java.io.File
import com.paic.server.JsonRestPlan
import scala.collection.JavaConverters._

class Plan(sourceFiles:List[File]) extends JsonRestPlan("test","tests",new TestingRepository(sourceFiles)){
  def this(sourceFiles:java.util.List[File])=this(sourceFiles.asScala.toList)
}