package domain.plan

import java.io.File

import domain.repository.DomainRepository
import org.json4s.Extraction._
import server.JsonRestHelper
import unfiltered.netty.ServerErrorResponse
import unfiltered.netty.cycle.ThreadPool
import unfiltered.request.{GET, Path, Seg}
import unfiltered.response._

import scala.util.control.Exception._

class Plan(root:File)  extends unfiltered.netty.cycle.Plan with ThreadPool with ServerErrorResponse with JsonRestHelper{

  val repository = new DomainRepository(root)

  def intent = {
    case req@GET(Path(Seg("domains"  :: Nil))) => {
      checkAcceptJson(req) {
        allCatch.either {
          decompose(repository.context.domains)
        } match {
          case Right(q) => Ok ~> JsonResponse(q)
//          case Right(q) => Ok ~> Json(q)  Json broken, NoSuchMethod error.
          case Left(t) => InternalServerError ~> ResponseString("server error -" + t.toString)
        }
      }
      }
    }
}


