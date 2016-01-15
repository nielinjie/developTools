package domain.parse

import scala.util.parsing.combinator.RegexParsers

/**
  * Created by nielinjie on 1/15/16.
  */
object LineParser extends RegexParsers{

  def CRLF = "\r\n" | "\n"
  def name: Parser[String] = "[\u4e00-\u9fa5\\w/]+".r
  def lined[T](parser:Parser[T]):Parser[T]={
    parser <~ CRLF
  }
  def all:Parser[List[String]]={
    rep(log((name))("name"))
//    rep(name)
  }

}
