import { mutation, query } from './_generated/server';
import { Id } from "./_generated/dataModel";

/*
  declare it
    const getAllFunction = useMutation("themes:getAll");

  use it later
    const response = await getAllFunction();
  should return an array of all themes
*/
export const getAll = query(async ({ db }) => {
  return await db.query('themes');
});

/*
  declare it
    const getFunction = useMutation("themes:get");

  use it later
    const response = await getFunction(id);
*/
export const get = query(async ({ db }, themeId) => {
  try {
    const id = new Id("themes", themeId);
    return await db.get(id);
  } catch(x) {
    //catch unknown ID error
    const badId = /Invalid argument `id` for `db.get`/;
    if(badId.test(x)) {
      return null;
    }

    //unknown error, throw it
    throw x;
  }
});

/*
  declare it
    const addFunction = useMutation("themes:add");

  use it later
    const response = await addFunction({
      name,
      backgroundColor,
      formBackgroundColor,
      textColor,
      buttonBackgroundColor,
      buttonTextColor
    });
*/
export const add = mutation(async ({ db }, name, backgroundColor, formBackgroundColor, textColor, buttonBackgroundColor, buttonTextColor) => {
  return await db.insert('themes', {
    name,
    backgroundColor,
    formBackgroundColor,
    textColor,
    buttonBackgroundColor,
    buttonTextColor
  });
});

/*
  declare it
    const updateFunction = useMutation("themes:update");

  use it later
    const response = await updateFunction({
      name,
      backgroundColor,
      formBackgroundColor,
      textColor,
      buttonBackgroundColor,
      buttonTextColor
    });
*/
export const update = mutation(async ({ db }, id, name, backgroundColor, formBackgroundColor, textColor, buttonBackgroundColor, buttonTextColor) => {
  return await db.replace(id, {
    name,
    backgroundColor,
    formBackgroundColor,
    textColor,
    buttonBackgroundColor,
    buttonTextColor
  });
});
