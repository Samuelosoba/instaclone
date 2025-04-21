import { useState } from "react";
import Modal from "../../../components/Modal";

export default function SeeLikes({ likeCount, post, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState(0);
  return (
    <>
      <p
        className=" mt-2 font-semibold cursor-pointer hover:text-gray-600 px-4 md:px-0"
        title="See who liked post"
        onClick={() => setIsModalOpen(true)}
      >
        {likeCount} likes
      </p>
      <Modal
        isOpen={isModalOpen}
        id="likesPost"
        title="likes"
        classname="w-[90%] max-w-[400px] mx-auto py-3 px-0"
        onClose={() => setIsModalOpen(false)}
      >
        {post?.likes?.length === 0 && (
          <p className="text-center my-6">
            No likes yet! Be the first to like.😒
          </p>
        )}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
          type="button"
          onClick={() => setIsModalOpen(false)}
        >
            <i className="ri-close-line text-xl"></i>
        </button>
      </Modal>
    </>
  );
}
