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
  val unknown = "Unknown"
  case class Domain(entities: List[Entity])
  case class Entity(name: String, methods:List[Method] = Nil, properties:List[Property]=Nil, alias: List[String] = Nil) extends Referable
  case class Property(name:String,typ:String=unknown)
  case class Method(name:String,typ:String=unknown,args:List[Arg]=Nil)
  case class Arg(name:String, typ:String=unknown)

}