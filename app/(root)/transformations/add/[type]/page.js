import { auth } from '@clerk/nextjs/server';
import Header from "../../../../../components/shared/Header";
import TransformationForm from "../../../../../components/shared/TransformationForm";
import { transformationTypes } from "../../../../../constants/index";
import { getUserById } from "../../../../../lib/actions/User.actions";
import { redirect } from 'next/navigation';

const AddTransformationTypes = async ({ params }) => {
  const { type } = await params;
  
  // Get user authentication details
  const { userId } = await auth();

  // Redirect if user is not authenticated
  if (!userId) {
    redirect("/sign-up");
  }

  // Fetch user details
  const user = await getUserById(userId);

  // Handle case where user is not found
  if (!user) {
    return <p className="text-red-500">Error: User not found.</p>;
  }

  // Fetch transformation type
  const transformation = transformationTypes[type];

  // Handle invalid transformation type
  if (!transformation) {
    return <p className="text-red-500">Error: Invalid transformation type.</p>;
  }

  return (
    <>
      <Header title={transformation.title} subTitle={transformation.subTitle} />
      <section className='mt-10'>
      <TransformationForm
        action="Add"
        userId={user._id}  // Safe now because we checked user existence
        type={transformation.type}
        creditBalance={user.creditBalance}
      />
      </section>
    </>
  );
};

export default AddTransformationTypes;
