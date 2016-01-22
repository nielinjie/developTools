package domain.parse

import java.io.Serializable

import domain.dsl.EntitiesDSL._

import scala.util.parsing.combinator.RegexParsers

/**
  * Created by nielinjie on 1/14/16.
  */
object EntityParser extends RegexParsers {
  protected override val whiteSpace = """(\s|//\S*|(?m)/\*(\*(?!/)|[^*])*\*/)+""".r


private val COMMA: String = ","
  private val COLON: String = ":"
  private val BRACE: String = "{}"
  private val PAREN: String = "()"

  def comment = "//(.*)".r

  private val ENTITY = "entity"

  def name: Parser[String] = "[\u4e00-\u9fa5\\w/]+".r

  def qName: Parser[QName] = rep1sep(name, ".").map(QName.apply)


  def entity: Parser[Entity] = positioned({
    ENTITY ~> qName ~(COLON ~> qName).? ~ blocked((method | property).*).? ^^ {
      case (qName ~ parent ~ methodsOrProperties) =>
        val (methods, properties) = methodsOrProperties.map(_.partition {
          case mp =>
            mp.isInstanceOf[Method]
        }).getOrElse((List(), List()))
        Entity(qName,parent, methods.map(_.asInstanceOf[Method]), properties.map(_.asInstanceOf[Property]))
    }
  })

  def inner: Parser[Inner] = positioned({
    name.? ~ blocked(property.*) ^^ {
      case (name ~ properties) =>
        Inner(name.getOrElse(unknown), properties)
    }
  })

  def domain: Parser[Domain] = {
    blocked(entity.*) ^^ {
      case entities =>
        Domain(entities)
    }
  }


  def method: Parser[Method] = positioned({
    (name ~ aroundBy(argList, PAREN) ~ (COLON ~> qName).?) ^^ {
      case (name ~ args ~ ty) =>
        Method(name, ty.getOrElse(unknownQ), args)
    }
  })

  def argList: Parser[List[Arg]] = {
    repsep(arg, COMMA)
  }

  def arg: Parser[Arg] = {
    (name ~ (COLON ~> qName).?) ^^ {
      case name ~ ty =>
        Arg(name, ty.getOrElse(unknownQ))
    }
  }

  def toE(op: Any): Either[ QName,Inner] = {
   op match {
     case b: Inner => Right(b)
     case _ => Left(op.asInstanceOf[QName])
   }
  }

  def property: Parser[Property] = positioned({


    def ty: Parser[Either[ QName,Inner]] = {
      (COLON ~> (inner | qName)) ^^ {
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
    def nameOnly = name.map(Property(_, Left(unknownQ)))
    def tyOnly = ty.map(Property(unknown, _))
    full | tyOnly | nameOnly
  })


  def blocked[T](parser: Parser[T]): Parser[T] = {
    aroundBy(parser, BRACE)
  }


  def aroundBy[T](parser: Parser[T], around: String) = {
    val left: String = around.head.toString
    val right: String = around.last.toString
    left ~> parser <~ right
  }


}
