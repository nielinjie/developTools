package domain.repository

import domain.Domain
import org.json4s.Extraction._
import org.json4s._
import org.json4s.native.Serialization
import org.json4s.native.Serialization._

/**
  * Created by nielinjie on 1/15/16.
  */
object Json {
  def json(domain: Domain): String = {
    implicit val formats = Serialization.formats(NoTypeHints)
    write(domain)
  }

  def toJValue(domain: Domain): JObject = {
    implicit val formats = Serialization.formats(NoTypeHints)
    decompose(domain).asInstanceOf[JObject]
  }
}
