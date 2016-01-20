package domain.repository

import java.io.File

import domain.dsl.{Builder, Context}




class DomainRepository(val path: File) {
  val context:Context =  new Builder(path).build()

}
