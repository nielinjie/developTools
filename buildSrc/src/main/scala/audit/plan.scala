package com.paic.developer.code

import com.paic.server.{Repository, JsonRestPlan}
import java.io.File
import org.json4s._
import org.json4s.native.Serialization
import org.json4s.Extraction._
import com.paic.developer.svn.{SVN,Diff}

class DiffPlan(val userName: String, val password: String, val url: String,val workFolder:File)
  extends JsonRestPlan("diff","diffs",new DiffRepository(userName,password,url,workFolder))


class DiffRepository(val userName: String, val password: String, val url: String,val workFolder:File) extends Repository{
  implicit val formats = Serialization.formats(NoTypeHints)
  val svn=new SVN(userName,password,url,workFolder)
  def diff:Diff=Diff(svn.diff())
  def query(query: Option[JObject]) = {
    query match {
      case None => List(decompose(diff).asInstanceOf[JObject])
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