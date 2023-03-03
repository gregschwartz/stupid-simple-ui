import { mutation, query } from './_generated/server';

/*
  declare it
    const getFunction = useMutation("themes:get");

  use it later
    const response = await getFunction(id);
*/
export const get = query(async ({ db }, themeId) => {
  return await db.get(themeId);
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
