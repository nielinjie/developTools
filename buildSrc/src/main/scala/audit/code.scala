package com.paic.developer.code


import scala.collection.JavaConversions._

import japa.parser.ast.visitor.VoidVisitorAdapter
import japa.parser.ast.body.{ClassOrInterfaceDeclaration, MethodDeclaration}
import japa.parser.ast.{PackageDeclaration, CompilationUnit}
import scala.collection.mutable

case class Method(clazz: Clazz, name: String)

object Method {
  def apply(fullName: String): Method = {
    val parts = fullName.split("\\.").toList
    val packageClass = parts.init
    val methodArgs = parts.last
    Method(Clazz(packageClass.mkString(".")), methodArgs)
  }
  def apply(pck:PackageDeclaration,clzz:ClassOrInterfaceDeclaration,method:MethodDeclaration):Method={
    Method(Clazz(pck.getName+"."+clzz.getName),methodToString(method))
  }
  def methodToString(method: MethodDeclaration): String = {
    val p = Option(method.getParameters) match {
      case Some(ps) => ps.map {
        case p =>
         p.getType.toString
      }.mkString(",")
      case _ => ""
    }
    return method.getName + "(" + p + ")"
  }
}

case class Clazz(name: String)



object Code {
  implicit class RCU(cu:CompilationUnit){
    def classOrInterfaces:List[ClassOrInterfaceDeclaration] = cu.getTypes.flatMap{
      case t:ClassOrInterfaceDeclaration => Some(t)
      case _ => None
    }.toList
  }
  implicit class RCI(ci:ClassOrInterfaceDeclaration){
    def methods:List[MethodDeclaration] ={
      Code.getMethods(ci)
    }
  }
  class MethodVisitor(val bl:mutable.MutableList[MethodDeclaration]) extends VoidVisitorAdapter[String] {
    override def visit(n: MethodDeclaration, arg: String):Unit ={
      bl+=n
    }
  }
  def getMethods(t: ClassOrInterfaceDeclaration):List[MethodDeclaration]={
    val re:mutable.MutableList[MethodDeclaration] = new mutable.MutableList()
    new MethodVisitor(re).visit(t, null)
    re.toList
  }

}