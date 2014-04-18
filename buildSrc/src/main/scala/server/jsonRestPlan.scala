package com.paic.server

import unfiltered.request._
import unfiltered.response._
import org.json4s._
import org.json4s.JsonAST.{JString, JField, JArray}

import scala.util.control.Exception._

import org.json4s.native.JsonMethods._

import scalaz.{Validation, Failure, Success}
import org.json4s.ext.JodaTimeSerializers
import org.slf4j.{Logger, LoggerFactory}
import unfiltered.filter.request.ContextPath
import unfiltered.netty.cycle.ThreadPool
import unfiltered.netty.ServerErrorResponse


class JsonRestPlan(val objName:String,val collectionName:String,val repository:Repository) extends unfiltered.netty.cycle.Plan with ThreadPool with ServerErrorResponse{
  val log: Logger = LoggerFactory.getLogger(classOf[JsonRestPlan])

  def validate(obj: JValue): Validation[String, JValue] =Success(obj)

  object JsonBody {
    implicit val formats = DefaultFormats++JodaTimeSerializers.all

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

  def query(q: Option[JObject]) = Ok ~> Json(JArray(repository.query(q)))

  def queryOne(q: Option[JObject]) = {
    repository.query(q).headOption match {
      case Some(h) =>
        Ok ~> Json(h)
      case _ =>
        NotFound ~> ResponseString("not found - " + q.toString)
    }
  }

  object Query extends Params.Extract("query", Params.first)

  lazy val collectionPath =  "/"+collectionName

  /**
   * POST -> create SUB RESOURCE, so, post to a collection is creating a object
   * GET -> get
   * PUT -> update
   * DELETE -> delete
   * @return
   */
  def intent = {
    case req@GET(Path(Seg(`objName` :: id :: Nil))) => {
      checkAcceptJson(req) {
        queryOne(Some(idQuery(id)))
      }
    }
    case req@PUT(Path(Seg(`objName` :: id :: Nil))) => {
      ???
    }
    case req@DELETE(Path(Seg(`objName` :: id :: Nil))) => {
      ???
    }
    case req@GET(Path( `collectionPath`)) => {
      checkAcceptJson(req) {
        req match {
          case Params(Query(qu)) => {
            allCatch.either {
              parse(qu).asInstanceOf[JObject]
            } match {
              case Right(q) => query(Some(q))
              case Left(t) => BadRequest ~> ResponseString("query is not cool -" + t.toString)
            }
          }
          case _ =>
            query(None)
        }
      }
    }
    case req@(POST(Path(`collectionPath`))) => {
      checkContentJson(req) {
        req match {
          case JsonBody(c) => {
            validate(c) match {
              case Success(d) => {
                val uuid=repository.add(c.asInstanceOf[JObject])
                Created ~> Json(JObject(JField("id",JString(uuid.toString))))
              }
              case Failure(f) => BadRequest ~> ResponseString(f)
            }
          }
          case _ => BadRequest ~> ResponseString("Invalid json data")
        }
      }
    }

    //Collection has no PUT or DELETE
  }
}