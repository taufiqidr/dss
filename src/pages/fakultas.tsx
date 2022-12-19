import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loading from "../../components/loading";
import { trpc } from "../utils/trpc";
import { BsTrashFill, BsPencilFill } from "react-icons/bs";

const FakultasPage = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const { data: fakultas, isLoading } = trpc.fakultas.getAll.useQuery();
  const [idFakultas, setIdFakultas] = useState("");
  const [namaFakultas, setNamaFakultas] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  if (isLoading) return <Loading />;

  return (
    <div className="m-3 flex flex-col">
      <AddModal
        modalHidden={addModalVisible}
        setModalHidden={setAddModalVisible}
      />
      <UpdateModal
        modalHidden={updateModalVisible}
        setModalHidden={setUpdateModalVisible}
        id_fakultas={idFakultas}
        nama_fakultas={namaFakultas}
      />
      <DeleteModal
        modalHidden={deleteModalVisible}
        setModalHidden={setDeleteModalVisible}
        id_fakultas={idFakultas}
      />
      <h1 className="text-4xl">Fakultas</h1>

      {isAdmin && (
        <div className="flex w-full justify-end">
          <button
            className="h-10 w-20 rounded-lg border p-1 font-bold"
            onClick={() => {
              setAddModalVisible(true);
            }}
          >
            Add
          </button>
        </div>
      )}
      <table className="mt-3 w-full border text-left">
        <thead className="border uppercase">
          <tr>
            <th scope="col" className="py-3 px-6">
              Nama Fakultas
            </th>
            <th scope="col" className="py-3 px-6 text-center">
              Jumlah Jurusan
            </th>
            <th scope="col" className="py-3 px-6 text-center">
              Jumlah Mahasiswa
            </th>
            {isAdmin && (
              <th scope="col" className="py-3 px-6 text-center">
                Menu
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {fakultas?.map((f) => (
            <tr className="border-b " key={f.id}>
              <td className="py-4 px-6">{f.nama_fakultas}</td>
              <td className="py-4 px-6 text-center">{f.jurusan.length}</td>
              <td className="py-4 px-6 text-center">{f.mahasiswa.length}</td>
              {isAdmin && (
                <td className="flex justify-between py-4 px-6 text-center">
                  <BsTrashFill
                    role={"button"}
                    onClick={() => {
                      setDeleteModalVisible(true);
                      setIdFakultas(f.id);
                    }}
                  />{" "}
                  <BsPencilFill
                    role={"button"}
                    onClick={() => {
                      setUpdateModalVisible(true);
                      setIdFakultas(f.id);
                      setNamaFakultas(f.nama_fakultas);
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FakultasPage;

interface ModalProps {
  modalHidden?: boolean;
  setModalHidden: React.Dispatch<React.SetStateAction<boolean>>;
  id_fakultas?: string;
  nama_fakultas?: string;
}

const AddModal = ({ modalHidden, setModalHidden }: ModalProps) => {
  const utils = trpc.useContext();
  const [namaFakultas, setNamaFakultas] = useState("");
  const disabled = !Boolean(namaFakultas);
  const btn_save = disabled
    ? "w-full rounded-lg bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:w-auto"
    : "w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto";

  const postFakultas = trpc.fakultas.postFakultas.useMutation({
    onMutate: () => {
      utils.fakultas.getAll.cancel();
      const optimisticUpdate = utils.fakultas.getAll.getData();

      if (optimisticUpdate) {
        utils.fakultas.getAll.setData(undefined, [
          {
            id: Math.random().toString(),
            nama_fakultas: namaFakultas,
            jurusan: [],
            mahasiswa: [],
          },
          ...optimisticUpdate,
        ]);
      }
    },
    onSettled: () => {
      utils.fakultas.getAll.invalidate();
      setModalHidden(false);
    },
  });
  return (
    <div
      id="modal-container"
      aria-hidden="true"
      className={`fixed inset-0 z-50 backdrop-blur-sm ${
        modalHidden ? "flex" : "hidden"
      }`}
    >
      <div className="relative m-auto h-5/6 w-full bg-white shadow dark:bg-black sm:w-1/2 sm:rounded-lg">
        <div className="m-5 flex flex-col ">
          <div className="item-center mb-3 flex justify-between">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Tambahkan Fakultas
            </h3>
            <button
              type="button"
              onClick={() => setModalHidden(false)}
              className="items-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-toggle="authentication-modal"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              postFakultas.mutate({
                name: String(namaFakultas),
              });
              setNamaFakultas("");
            }}
          >
            <div>
              <label
                htmlFor="nama_fakultas"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama
              </label>
              <input
                type={"text"}
                id="nama_fakultas"
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="nama fakultas"
                value={namaFakultas}
                onChange={(e) => setNamaFakultas(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={btn_save}>
              Simpan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
const UpdateModal = ({
  modalHidden,
  setModalHidden,
  id_fakultas,
  nama_fakultas,
}: ModalProps) => {
  useEffect(() => {
    setNamaFakultas(String(nama_fakultas));
  }, [nama_fakultas]);

  const utils = trpc.useContext();
  const [namaFakultas, setNamaFakultas] = useState("");
  const disabled = !Boolean(namaFakultas);
  const btn_save = disabled
    ? "cursor-default w-full rounded-lg bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:w-auto"
    : "w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto";

  const updateFakultas = trpc.fakultas.updateFakultas.useMutation({
    onMutate: () => {
      utils.fakultas.getAll.cancel();
      const optimisticUpdate = utils.fakultas.getAll.getData();

      if (optimisticUpdate) {
        utils.fakultas.getAll.setData(
          undefined,
          optimisticUpdate.map((t) =>
            t.id === id_fakultas
              ? {
                  id: Math.random().toString(),
                  nama_fakultas: String(namaFakultas),
                  jurusan: [],
                  mahasiswa: [],
                }
              : t
          )
        );
      }
    },
    onSettled: () => {
      utils.fakultas.getAll.invalidate();
      setModalHidden(false);
    },
  });
  return (
    <div
      id="modal-container"
      aria-hidden="true"
      className={`fixed inset-0 z-50 backdrop-blur-sm  ${
        modalHidden ? "flex" : "hidden"
      }`}
    >
      <div className="relative m-auto h-5/6 w-full bg-white shadow dark:bg-black sm:w-1/2 sm:rounded-lg">
        <div className="m-5 flex flex-col ">
          <div className="item-center mb-3 flex justify-between">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit Fakultas
            </h3>
            <button
              type="button"
              onClick={() => setModalHidden(false)}
              className="items-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-toggle="authentication-modal"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              updateFakultas.mutate({
                id: String(id_fakultas),
                name: String(namaFakultas),
              });
              setNamaFakultas("");
            }}
          >
            <div>
              <label
                htmlFor="nama_fakultas"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama
              </label>
              <input
                type={"text"}
                id="nama_fakultas"
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="nama fakultas"
                value={namaFakultas}
                onChange={(e) => setNamaFakultas(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={btn_save}>
              Simpan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
const DeleteModal = ({
  modalHidden,
  setModalHidden,
  id_fakultas,
}: ModalProps) => {
  const utils = trpc.useContext();
  const deleteFakultas = trpc.fakultas.deleteFakultas.useMutation({
    onMutate: () => {
      utils.fakultas.getAll.cancel();
      const optimisticUpdate = utils.fakultas.getAll.getData();

      if (optimisticUpdate) {
        utils.fakultas.getAll.setData(
          undefined,
          optimisticUpdate.filter((f) => f.id != id_fakultas)
        );
      }
    },
    onSettled: () => {
      utils.fakultas.getAll.invalidate();
      setModalHidden(false);
    },
  });
  return (
    <div
      id="modal-container"
      aria-hidden="true"
      className={`fixed inset-0 z-50 backdrop-blur-sm ${
        modalHidden ? "flex" : "hidden"
      }`}
    >
      <div className="relative m-auto h-auto w-full bg-white shadow dark:bg-black sm:w-1/2 sm:rounded-lg">
        <div className="m-5 flex flex-col ">
          <div className="item-center mb-3 flex justify-between">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Delete Fakultas
            </h3>
            <button
              type="button"
              onClick={() => setModalHidden(false)}
              className="items-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-toggle="authentication-modal"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <p>Apakah anda yakin akan menghapus fakultas ini?</p>
            <div className="flex gap-x-3">
              <button
                className="w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto"
                onClick={() => {
                  deleteFakultas.mutate({
                    id: String(id_fakultas),
                  });
                }}
              >
                Ya
              </button>
              <button
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                onClick={() => setModalHidden(false)}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
