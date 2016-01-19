package domain.parse

import domain.dsl.FunctionFirstDSL.{Domain, Entity, Function}
import domain.dsl.Ref

import scala.util.parsing.combinator.RegexParsers

/**
  * Created by nielinjie on 1/14/16.
  */
object Parser extends RegexParsers {


  def COMMA = ","

  def Q = "{"

  def Q2 = "}"

  def CRLF = "\r\n" | "\n"

  def SPACES = "[ \t]".r

  def SC = SPACES | CRLF
  def comment = "//(.*)".r

  def name = "[\u4e00-\u9fa5\\w/]+".r

  def domain: Parser[Domain] = {
    blocked(func *)  ^^ {
      case funcs =>
        Domain(funcs)
    }
  }
  def alias:Parser[List[String]] ={
    (((SC*)~>":" ~>name)* )
  }
  def func: Parser[Function] = {
    (name ~(SC*)~ alias ~(SC*) ~( blocked((entity | ref |comments) *) ?)) ^^ {
      case name ~ _ ~ als ~ _ ~ entitiesOrRef =>
        val (entities,refsORComments) = entitiesOrRef.map(_.partition{
          case er=>
            er.isInstanceOf[Entity]
        }).getOrElse((List(),List()))
        val (refs, comments) = refsORComments.partition(_.isInstanceOf[Ref])
        Function(refs.map(_.asInstanceOf[Ref]), entities.map(_.asInstanceOf[Entity]),comments.map(_.asInstanceOf[String]), name,als)
    }
  }


  def entity: Parser[Entity] = {
    lined(name) ^^ {
      case name =>
        Entity(name)
    }
  }

  def ref:Parser[Ref] ={
    def arrow = "-" ~> "i|g|e".r ^^ {
      case ty =>
        ty match {
          case "i" => "include"
          case "g" => "g"
          case "e" => "extend"
        }
    }
    lined(arrow ~ (SC *) ~ func) ^^ {
      case (a ~ s ~ fun) =>
        Ref(fun,a)
    }
  }
  def comments:Parser[String]=
    lined(comment) ^^ {
      _.drop(2)
    }

  def blocked[T](parser: Parser[T]): Parser[T] = {
    (SC *) ~> Q ~> lined(parser) <~ Q2 <~ (SC *)
  }

  def lined[T](parser: Parser[T]): Parser[T] = {
    (SC *) ~> (parser) <~ (SC *)
  }



}
