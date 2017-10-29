'use strict'

const Mapper = require( '@mojule/mapper' )
const extendOptions = require( '@mojule/mapper/src/extend-options' )

const Node = () => {
  return {
    value: undefined,
    childNodes: []
  }
}

const TreeMapper = options => {
  options = extendOptions( options )

  const { map } = options

  const wrappedMap = Object.keys( map ).reduce( ( obj, key ) => {
    const LogFn = fn => ( value, options ) => {
      const { is } = options
      const node = Node()
      const currentParent = options[ TreeMapper.parentSymbol ]

      if( currentParent ){
        node[ TreeMapper.parentSymbol ] = currentParent
        currentParent.childNodes.push( node )
      } else {
        TreeMapper.root = node
      }

      options[ TreeMapper.parentSymbol ] = node

      const result = fn( value, options )

      node.value = result

      return result
    }

    obj[ key ] = LogFn( map[ key ] )

    return obj
  }, {} )

  const wrappedOptions = Object.assign( {}, options, { map: wrappedMap } )

  return Mapper( wrappedOptions )
}

TreeMapper.parentSymbol = Symbol( 'parentNode' )
TreeMapper.root = null

module.exports = TreeMapper
