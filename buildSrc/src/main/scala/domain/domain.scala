package com.paic.domain

object DSL {

  case class Domain(function: List[Function])

  case class Function(ref: List[Ref], entities: List[Entity], comments: List[String], name: String, alias: List[String] = List()) extends Referable

  case class Entity(name: String, alias: List[String] = List()) extends Referable

  case class Id(name: String) extends Referable

  case class Ref(to: Referable, typ: String)

  trait Referable {
    val name: String
  }


}

object Graph {

  case class Domain(functions: List[Function], entities: List[Entity], refs: List[Ref]) {
    def normalize: Domain = {
      this.copy(
        functions = distinctBy(this.functions, {
          f: Function => f.name
        }),
        entities = distinctBy(this.entities, {
          e: Entity => e.name
        }),
        refs = distinctBy(this.refs, {
          r: Ref => (r.from.name, r.to.name, r.typ)
        })
      )
    }

    def merge(b: Domain): Domain = {
      Domain(this.functions ++ b.functions, this.entities ++ b.entities, this.refs ++ b.refs).normalize
    }
  }

  case class Function(name: String, comments: List[String], alias: List[String] = List())

  case class Entity(name: String, alias: List[String] = List())

  case class Ref(from: Id, to: Id, typ: String)

  case class Id(name: String)



  def distinctBy[T, B](list: List[T], fun: T => B): List[T] = {
    Map[B, T](list.map(fun).zip(list).toList: _*).map(_._2).toList
  }
}