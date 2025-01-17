import { Injectable } from '@nestjs/common'
import { Product } from './product.entity'
import { User } from '@resources/user/user.entity'
import { BaseAbility, Action } from '@resources/base/base.ability'
import { Ability } from '@casl/ability'

export { Action }

type TProductSubjects = typeof Product | Product

const { READ, UPDATE, DELETE, CREATE } = Action

@Injectable()
export class ProductAbility extends BaseAbility<TProductSubjects> {
  create(user?: User): Ability<[Action, TProductSubjects]> {
    const { builder, permissions } = this.createBuilder(user)
    this.defineRules({ builder, permissions })
    return builder.build()
  }

  defineRules({ builder: { can }, permissions }) {
    can(READ, Product) // TODO make a user to update only their products, based on their company

    if (permissions.isManager) {
      can(CREATE, Product)
      can(UPDATE, Product)
      can(DELETE, Product)
    }
  }
}
