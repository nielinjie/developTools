package domain.dsl


object FunctionFirstDSL {

  case class Domain(function: List[Function])

  case class Function(ref: List[Ref], entities: List[Entity], comments: List[String], name: String, alias: List[String] = List()) extends Referable

  case class Entity(name: String, alias: List[String] = List()) extends Referable






}
trait Referable {
  val name: String
}
case class Id(name: String) extends Referable
case class Ref(to: Referable, typ: String)



object EntitiesDSL{
  case class Entity(name: String, alias: List[String] = List()) extends Referable

}