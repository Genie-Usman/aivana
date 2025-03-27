import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Header from "../../../../../components/shared/Header";
import TransformationForm from "../../../../../components/shared/TransformationForm";
import { transformationTypes } from "../../../../../constants";
import { getUserById } from "../../../../../lib/actions/User.actions";
import { getImageById } from "../../../../../lib/actions/Image.actions";

const UpdatePage = async ({ params}) => {
  const {id} = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const image = await getImageById(id);

  const transformation =
    transformationTypes[image.transformationType];

  return (
    <>
      <Header title={transformation.title} subTitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user._id}
          type={image.transformationType}
          creditBalance={user.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default UpdatePage;