export const productTypes = `
  query ProductTypes {
    productTypes
    productStatuses
  }
`

export const productList = `
  query ProductList($filter: ProductFilterInput) {
    products(filter: $filter) {
      items {
        id
        type
        status
        name
        slug
        brand
        price
        stockQty
        specs
      }
      total
      page
      pageSize
    }
  }
`

export const productById = `
  query Product($id: ID!) {
    product(id: $id) {
      id
      type
      status
      name
      slug
      brand
      sku
      price
      stockQty
      currency
      shortDescription
      tags
      specs
      compatibility
    }
  }
`

export const upsertProduct = `
  mutation UpsertProduct($input: ProductInput!) {
    upsertProduct(input: $input) {
      success
      message
      item {
        id
        name
        slug
      }
    }
  }
`

export const deleteProduct = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`
