package domain.dsl

/**
  * Created by nielinjie on 1/14/16.
  */
object EntitiesDSL{
  val unknown = "Unknown"
  val unknownQ = QName(List("Unknown"))
  case class QName(names:List[String])
  case class Domain(entities: List[Entity])
  case class Entity(name: QName, methods:List[Method] = Nil, properties:List[Property]=Nil)
  case class Inner(name:String,properties:List[Property])
  case class Property(name:String,typ:Either[QName,Inner])
  case class Method(name:String,typ:QName,args:List[Arg]=Nil)
  case class Arg(name:String, typ:QName)

}