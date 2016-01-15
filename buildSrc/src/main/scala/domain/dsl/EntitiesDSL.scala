package domain.dsl

/**
  * Created by nielinjie on 1/14/16.
  */
object EntitiesDSL{
  case class Entity(name: String, alias: List[String] = List()) extends Referable

}
