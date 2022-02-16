response of create may  not be a { body: ... }, rather : {
  "resource": {
    object (Task)
  }
}

fix for both packs if necessary

ensure that pack formulas with no params have their execute as ([], context) and not (context)