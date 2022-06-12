import MemberModel, { Member, MemberImage } from '../models/member';
import { removeMedia } from './mediaService';

export const addNewMember = async (memberDetails: Member, image: MemberImage) => {
  if (memberDetails.firstName?.length && memberDetails.lastName?.length) {
    const member = new MemberModel({
      ...memberDetails,
      imagePath: image?.imagePath || null,
      imageId: image?.imageId || null,
    });
    const newMember = await member.save();
    return newMember;
  }
  return false;
};

export const updateMemberById = async (id: string, memberDetails: Member, image: MemberImage) => {
  // we should check if there is an image uploaded, so we should delete it after we replace it
  const member = await MemberModel.findById(id);
  // if an image is sent, then the body should be in the doc obj
  // const file = req.file as CloudinaryFile;
  let updatedMemberData = memberDetails;
  if (image?.imagePath && image?.imageId) {
    await removeMedia(member.imageId);
    updatedMemberData = {
      ...memberDetails,
      imagePath: image.imagePath,
      imageId: image.imageId,
    };
  }

  const updatedMember = await MemberModel.findByIdAndUpdate(id, updatedMemberData, {
    new: true,
  });
  return updatedMember;
};

export const getMemberById = async (id: string) => {
  const user = await MemberModel.findById(id);
  return user?.toJSON();
};
