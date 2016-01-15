package domain.dsl

/**
  * Created by nielinjie on 1/14/16.
  */
object EntitiesDSL{
  val unknown = "Unknown"
  case class Domain(entities: List[Entity])
  case class Entity(name: String, methods:List[Method] = Nil, properties:List[Property]=Nil, alias: List[String] = Nil) extends Referable
  case class Inner(name:String,properties:List[Property])
  case class Property(name:String,typ:Either[String,Inner]=Left(unknown))
  case class Method(name:String,typ:String=unknown,args:List[Arg]=Nil)
  case class Arg(name:String, typ:String=unknown)

}