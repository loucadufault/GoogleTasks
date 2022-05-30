remove console logs from controller error handling
add typing to controller params x
fix spacing/add formatter
eslint for typing
remove variable that are defined and immediately returned (e.g. in controller)

standardize what to return for mutation operations (Create update delete move) should it be id, url, the entire task

should service functions signature be changed or just linear e.g. update({updateParaams}, {findParams}) or ({queryParams}, {requestParams}) or ({query: {}, request: {}})
