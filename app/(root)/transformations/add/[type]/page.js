import { auth } from '@clerk/nextjs/server';
import Header from "../../../../../components/shared/Header";
import TransformationForm from "../../../../../components/shared/TransformationForm";
import { transformationTypes } from "../../../../../constants/index";
import { getUserById } from "../../../../../lib/actions/User.actions";
import { redirect } from 'next/navigation';

const AddTransformationTypes = async ({ params }) => {
  const { type } = await params;  
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-up");
  }

  const user = await getUserById(userId);

  if (!user) {
    return <p className="text-red-500">Error: User not found.</p>;
  }

  const transformation = transformationTypes[type];

  if (!transformation) {
    return <p className="text-red-500">Error: Invalid transformation type.</p>;
  }

  return (
    <>
      <Header title={transformation.title} subTitle={transformation.subTitle} />
      <section className='mt-10'>
      <TransformationForm
        action="Add"
        userId={user._id}
        type={transformation.type}
        creditBalance={user.creditBalance}
      />
      </section>
    </>
  );
};

export default AddTransformationTypes;
