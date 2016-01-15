package domain.parse

import domain.dsl.EntitiesDSL._

import scala.util.parsing.combinator.RegexParsers

/**
 * Created by nielinjie on 1/14/16.
 */
object EntityParser extends RegexParsers {

  def COMMA = ","

  def Q = "{"

  def Q2 = "}"

  def CRLF = "\r\n" | "\n"

  def SPACES = "[ \t]".r

  def SC = SPACES | CRLF

  def SCS = SC *

  def comment = "//(.*)".r

  def name: Parser[String] = "[\u4e00-\u9fa5\\w/]+".r


  def entity: Parser[Entity] = {
    "entity" ~> spaceAround(name) ~ (blocked((method | property) *) ?) ^^ {
      case (name ~ methodsOrProperties) => {
        val (methods, properties) = methodsOrProperties.map(_.partition {
          case mp =>
            mp.isInstanceOf[Method]
        }).getOrElse((List(), List()))
        Entity(name, methods.map(_.asInstanceOf[Method]), properties.map(_.asInstanceOf[Property]))
      }
    }
  }

  def domain: Parser[Domain] = {
    blocked(entity *) ^^ {
      case entities =>
        Domain(entities)
    }
  }

  def method: Parser[Method] = {
    lined((name <~ spaceAround("()")) ~ ((spaceAround(":") ~> name) ?)) ^^ {
      case (name ~ ty) =>
        Method(name, ty.getOrElse(unknown))
    }
  }

  def argList: Parser[List[Arg]] = {
    join(arg, ",")
  }

  def arg: Parser[Arg] = {
    (name ~ ((spaceAround(":") ~> name) ?)) ^^ {
      case name ~ ty =>
        Arg(name, ty.getOrElse(unknown))
    }
  }

  def property: Parser[Property] = {
    lined(name ~ ((spaceAround(":") ~> name) ?)) ^^ {
      case name ~ ty =>
        Property(name, ty.getOrElse(unknown))
    }
  }


  def blocked[T](parser: Parser[T]): Parser[T] = {
    SCS ~> Q ~> lined(parser) <~ Q2 <~ SCS
  }

  def lined[T](parser: Parser[T]): Parser[T] = {
    SCS ~> parser <~ SCS //TODO why not a crlf ending? <~ CRLF
  }

  def spaceAround[T](parser: Parser[T]): Parser[T] = {
    (SPACES *) ~> parser <~ (SPACES *)
  }

  def aroundBy[T](parser: Parser[T], left: String, right: String = "") = {
    spaceAround(left) ~> parser <~ spaceAround(if (right.isEmpty) left else right)
  }


  //TODO 这个应该有内置的吧?
  def join[T](parser: Parser[T], split: String): Parser[List[T]] = {
    ((parser ~ ((split ~> parser) *)) ?) ^^ {
      case Some(head ~ rest) =>
        head :: rest
      case None =>
        Nil
    }
  }
}
