package domain

import java.io.File
import com.paic.server.JsonRestPlan
import scala.collection.JavaConverters._

class Plan(sourceFiles:List[File]) extends JsonRestPlan("domain","domains",new DomainRepository(sourceFiles)){
  def this(sourceFiles:java.util.List[File])=this(sourceFiles.asScala.toList)
}