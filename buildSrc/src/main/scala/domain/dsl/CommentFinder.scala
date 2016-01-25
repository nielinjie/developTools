package domain.dsl

import domain.dsl.EntitiesDSL.{Comment, Domain}

import scala.util.matching.Regex.Match
import scala.util.parsing.input.{OffsetPosition, Positional}

/**
  * Created by nielinjie on 1/22/16.
  */
object CommentFinder {

  val singleLineComment = "//\\S*".r

  def findCommentIn(string: String): List[Comment] = {
    singleLineComment.findAllMatchIn(string).toList.map({
      m: Match =>
        val re = Comment(m.matched)
        re.setPos(OffsetPosition(string, m.start))
        re
    })
  }

  //TODO can't patch for inner members.
  def patchToDomain(comments: List[Comment], domain: Domain): Map[Position,Comment] = {
    val pros: List[Positional] =domain.entities ::: domain.entities.flatMap(_.members()).map(_.asInstanceOf[Positional])
    val items:List[(Comment,Option[Positional])]=comments.map {
      c:Comment =>
        (c,pros.find({
          p:Positional =>
            p.pos.line == c.pos.line
        }).orElse(pros.find({
          p:Positional =>
            p.pos.line == c.pos.line+1
        })))
    }
    items.filter(_._2.isDefined).map(x=>(Position(x._2.get.pos,domain.document),x._1)).toMap
  }


}
