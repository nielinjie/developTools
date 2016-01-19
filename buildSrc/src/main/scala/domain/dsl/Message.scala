package domain.dsl


import EntitiesDSL._

/**
  * Created by nielinjie on 1/19/16.
  */
object Message {

  def dump(context:Context,level:Level.Level):String={
    context.messagesIndex.values.flatten.filter(_.level >= level).map(_.display(context)).mkString("\n")
  }


  object Level extends Enumeration {
    type Level = Value
    val Debug, Info, Error = Value
  }

  trait Message {
    def display(context: Context): String
    def level: Level.Level
  }

  case class NameDuplicated(e: Entity, other: Entity) extends Message {
    var level = Level.Error
    def display(context: Context) = {
      s"name '${e.name.readable}' is duplicated with entity where - ${other.pos}"
    }
  }

  case class GuessingFullName(p: Product, q: QName, entity: Entity) extends Message {
    var level = Level.Debug
    def display(context: Context) = {
      s"name ${q.readable} at ${context.positionIndex.getOrElse(p, ???).readable} is guessing as ${entity.name.readable} "
    }
  }

  case class GuessedFullName(p: Product, q: QName, entity: Entity) extends Message {
    var level = Level.Info
    def display(context: Context) = {
      s"name ${q.readable} at ${context.positionIndex.getOrElse(p, ???).readable} is guessed as ${entity.name.readable} "
    }
  }

}
