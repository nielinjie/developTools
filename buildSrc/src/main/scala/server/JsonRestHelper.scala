package server


import org.json4s._
import native.JsonMethods._

import org.json4s.JsonAST.{JString, JField, JArray}

import org.json4s.ext.JodaTimeSerializers
import unfiltered.request.{RequestContentType, RequestHeader, Accepts, HttpRequest}
import unfiltered.response._

/**
  * Created by nielinjie on 1/19/16.
  */
trait JsonRestHelper {
  implicit val formats = DefaultFormats++JodaTimeSerializers.all

  object JsonResponse {

    def jsonToString(json: JValue) = compact(render(json))

    def apply(json: JValue) =
      new ComposeResponse(JsonContent ~> ResponseString(jsonToString(json)))

    def apply(json: JValue, cb: String) =
      new ComposeResponse(JsContent ~> ResponseString("%s(%s)" format(cb, jsonToString(json))))
  }

  object JsonBody {

    def unapply[T](req: HttpRequest[T]): Option[JValue] =
      unfiltered.request.JsonBody(req)
  }

  def checkAcceptJson(req: HttpRequest[_])(body: => ResponseFunction[Any]): ResponseFunction[Any] = {
    req match {
      case Accepts.Json(_) => body
      case _ => BadRequest ~> ResponseString("You must accept application/json")
    }
  }

  def checkContentJson(req: HttpRequest[_])(body: => ResponseFunction[Any]): ResponseFunction[Any] = {
    req match {
      case RequestContentType("application/json") => body
      case _ => BadRequest ~> ResponseString("You must supply application/json")
    }
  }

  def idQuery(id: String) = {
    JObject(List(JField("id", JObject(List(JField("$eq", JString(id)))))))
  }

}
