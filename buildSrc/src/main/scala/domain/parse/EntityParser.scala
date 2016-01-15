package domain.parse

import java.io.Serializable

import domain.dsl.EntitiesDSL._

import scala.util.parsing.combinator.RegexParsers

/**
  * Created by nielinjie on 1/14/16.
  */
object EntityParser extends RegexParsers {

  private val COMMA: String = ","
  private val COLON: String = ":"
  private val BRACE: String = "{}"
  private val PAREN: String = "()"

  def comment = "//(.*)".r

  private val ENTITY = "entity"
  private val keys: List[String] = List(ENTITY)

  def name: Parser[String] = "[\u4e00-\u9fa5\\w/]+".r


  def entity: Parser[Entity] = {
    ENTITY ~> name ~ blocked((method | property).*).? ^^ {
      case (name ~ methodsOrProperties) =>
        val (methods, properties) = methodsOrProperties.map(_.partition {
          case mp =>
            mp.isInstanceOf[Method]
        }).getOrElse((List(), List()))
        Entity(name, methods.map(_.asInstanceOf[Method]), properties.map(_.asInstanceOf[Property]))
    }
  }

  def inner: Parser[Inner] = {
    name ~ blocked(property.*) ^^ {
      case (name ~ properties) =>
        Inner(name, properties)
    }
  }

  def domain: Parser[Domain] = {
    blocked(entity.*) ^^ {
      case entities =>
        Domain(entities)
    }
  }


  def method: Parser[Method] = {
    (name ~ aroundBy(argList, PAREN) ~ (COLON ~> name).?) ^^ {
      case (name ~ args ~ ty) =>
        Method(name, ty.getOrElse(unknown), args)
    }
  }

  def argList: Parser[List[Arg]] = {
    repsep(arg, COMMA)
  }

  def arg: Parser[Arg] = {
    (name ~ (COLON ~> name).?) ^^ {
      case name ~ ty =>
        Arg(name, ty.getOrElse(unknown))
    }
  }

  def toE[T,U](op: Any): Either[T, U] = {
    op match {
      case a: T =>
        Left(a)
      case _ =>
        op match {
          case b: U => Right(b)
          case _ => ???
        }
    }
  }
  def property: Parser[Property] = {


    def ty: Parser[Either[String, Inner]] = {
      (COLON ~> (inner | name)) ^^ {
        case tyOrInner =>
          toE(tyOrInner)
      }
    }
    def full = {
      (name ~ ty) ^^ {
        case (name ~ ty) =>
          Property(name, ty)
      }
    }
    def nameOnly = name.map(Property(_, Left(unknown)))
    def tyOnly = ty.map(Property(unknown, _))
    full | tyOnly | nameOnly
  }


  def blocked[T](parser: Parser[T]): Parser[T] = {
    aroundBy(parser, BRACE)
  }


  def aroundBy[T](parser: Parser[T], around: String) = {
    val left: String = around.head.toString
    val right: String = around.last.toString
    left ~> parser <~ right
  }


}
