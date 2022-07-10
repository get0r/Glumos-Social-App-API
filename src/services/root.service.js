const _ = require('lodash');

const PAGE_SIZE = 10;

/**
 * It takes in a Mongoose model, a query object,
 * a sort object, and a page number, and returns a list
 * of documents from the database
 * @param DBmodel - The model you want to query.
 * @param [query] - The query object to be passed to the MongoDB find() method.
 * @param [sort] - The sort parameter is used to sort the data.
 * The sort parameter is a string, and the
 * format is: field1,-field2,field3. The field1, field2, field3 are the fields in the database. The
 * -field2 means that the field2 is sorted in descending
 * @param [page=1] - the page number
 * @returns An array of data
 */
const getOperatedData = async (DBmodel, query = {}, sort = {}, page = 1) => {
  const skip = page ? (+page - 1) * PAGE_SIZE : 0;
  let finalSort = {};
  if (sort instanceof String) {
    finalSort = {};
    const tempSort = sort.split(',');
    // eslint-disable-next-line no-restricted-syntax
    for (const item of tempSort) {
      const str = item.slice(0, -1);
      finalSort[str] = item.slice(-1) === '-' ? -1 : 1;
    }
  }

  let finalQuery = query;
  let data = [];
  if (query && query.q) {
    const searchQuery = { $text: { $search: query.q } };
    const fieldAdd = { score: { $meta: 'textScore' } };
    finalQuery = _.omit(query, ['q']);
    data = await DBmodel.find({ ...searchQuery, ...finalQuery }, fieldAdd)
      .sort(finalSort)
      .lean();
  } else {
    data = await DBmodel.find(finalQuery)
      .sort(finalSort)
      .lean();
  }

  return data;
};

/**
 * It takes a Mongoose model, a filter, and a new object, and returns the updated object
 * @param DBmodel - The model you want to update.
 * @param filter - the filter object to find the object to update
 * @param newObject - the new object that will be merged with the old object
 * @returns The updated object
 */
const updateData = async (DBmodel, filter, newObject) => {
  const oldObject = await DBmodel.find(filter);
  if (!oldObject) return null;

  const updatedObject = { ...oldObject, ...newObject };
  await DBmodel.update(filter, updatedObject);
  return updatedObject;
};

/**
 * It takes a Mongoose model, a document ID, and a new object, and returns the updated document
 * @param DBmodel - The model of the database you're using.
 * @param docId - the id of the document you want to update
 * @param newObject - the new object that will be merged with the old object
 * @returns The updated object
 */
const updateDataById = async (DBmodel, docId, newObject) => {
  const oldObject = await DBmodel.findById(docId);

  if (!oldObject) return null;

  const updatedObject = { ...oldObject.toObject(), ...newObject };
  await DBmodel.updateOne({ _id: docId }, updatedObject);
  return updatedObject;
};

module.exports = {
  getOperatedData,
  updateData,
  updateDataById,
};
