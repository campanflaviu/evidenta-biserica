import SpecialCaseModel, { SpecialCase } from '../models/specialCase';

export const addNewSpecialCase = async (caseDetails: SpecialCase) => {
  const specialCase = new SpecialCaseModel(caseDetails);

  const newSpecialCase = await specialCase.save();
  return newSpecialCase;
};
