/** Client-safe entry point of the people feature. */
export { usePerson } from "./api/use-person";
export { type UpdatePersonInput, useUpdatePerson } from "./api/use-update-person";
export { CreatePersonForm } from "./components/create-person-form";
export { PeopleList } from "./components/people-list";
export { ageFromBirthYear } from "./lib/age";
export {
  LIST_FIELDS,
  type PersonFieldName,
  type PersonFieldsValues,
  type PersonInput,
  type PersonSectionKey,
  personFieldsSchema,
  personSections,
  splitList,
  toPersonFieldsValues,
  toPersonInput,
} from "./lib/person-form";
