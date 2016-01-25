package domain.dsl

import java.io.File
import java.nio.file.{FileSystems, FileSystem, Path}
import scala.collection.JavaConversions._


import domain.dsl.EntitiesDSL.QName

import scala.collection.mutable
import scala.util.parsing.input.Positional

/**
 * Created by nielinjie on 1/14/16.
 */
object EntitiesDSL {
  val unknown = "Unknown"
  val unknownQ = QName(List("Unknown"))


  case class Domain(entities: List[Entity]) extends DocumentAware{
    def position(p:Positional)=Position(p.pos,this.document)
  }

  case class Entity(name: QName, parent: Option[QName], methods: List[Method] = Nil, properties: List[Property] = Nil) extends Positional with DocumentAware {
    def _members(entityOrInner: Product): List[Product] = {
      assert(entityOrInner.isInstanceOf[Entity] || entityOrInner.isInstanceOf[Inner])
      var pros:List[Property] = Nil
      var mes:List[Method] = Nil
      entityOrInner match {
        case e:Entity =>{
          pros=e.properties
          mes=e.methods
        }
        case i:Inner =>{
          pros = i.properties
        }
      }
      val thisLevel = pros ::: mes
      val innerLevel = pros.collect({
        case p: Property if p.typ.isRight =>
          _members(p.typ.right.getOrElse(???))
      }).flatten
      thisLevel ::: innerLevel
    }
    def members()=this._members(this)

  }

  case class Inner(name: String, properties: List[Property]) extends Positional

  case class Property(name: String, typ: Either[QName, Inner]) extends Positional

  case class Method(name: String, typ: QName, args: List[Arg] = Nil) extends Positional

  case class Arg(name: String, typ: QName)

  object QName {
    val rootS: String = "_"

  }

  case class QName(names: List[String]) {

    val isFull: Boolean = names.head eq QName.rootS

    def full(`package`: QName): QName = {
      QName(`package`.names ::: this.names)
    }

    def lastEq(q: QName): Boolean = {
      names.takeRight(q.names.length) == q.names
    }

    def readable: String = {
      names.mkString(".")
    }
  }

  case class Comment(cotent: String) extends Positional

}

trait DocumentAware {
  var document: Document = null


}


case class Document(path: File, root: File) {
  val relative = {
    val fs = FileSystems.getDefault
    fs.getPath(root.getAbsolutePath).relativize(fs.getPath(path.getAbsolutePath))
  }

  def getPackage: QName = {

    if (path eq root) return QName(Nil)

    QName(QName.rootS :: (
      if (relative.getParent != null)
        relative.getParent.iterator().toList.map(_.toString)
      else Nil)
    )
  }
}

case class Position(p: util.parsing.input.Position, doc: Document) {
  def readable: String = s"at $p in ${doc.relative}"
}