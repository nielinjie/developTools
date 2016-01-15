package domain.dsl

/**
  * Created by nielinjie on 1/14/16.
  */
object FunctionFirstDSL {

  case class Domain(function: List[Function])

  case class Function(ref: List[Ref], entities: List[Entity], comments: List[String], name: String, alias: List[String] = List()) extends Referable

  case class Entity(name: String, alias: List[String] = List()) extends Referable






}
