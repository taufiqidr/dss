import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Loading from "../../components/loading";
import { trpc } from "../utils/trpc";

const JurusanPage = () => {
  const { data: session } = useSession();

  const { data: jurusan, isLoading } = trpc.jurusan.getAll.useQuery();
  const [addModalVisible, setaddModalVisible] = useState(false);
  if (isLoading) return <Loading />;
  return (
    <div className="m-3 flex flex-col">
      <AddModal
        modalHidden={addModalVisible}
        setModalHidden={setaddModalVisible}
      />
      <h1 className="text-4xl">Jurusan</h1>
      {session?.user?.role === "admin" && (
        <div className="flex w-full justify-end">
          <button
            className="h-10 w-20 rounded-lg border p-1 font-bold"
            onClick={() => setaddModalVisible(true)}
          >
            Add
          </button>
        </div>
      )}
      <table className="mt-3 w-full border text-left">
        <thead className="border uppercase">
          <tr>
            <th scope="col" className="py-3 px-6">
              Nama Jurusan
            </th>
            <th scope="col" className="py-3 px-6">
              Nama Fakultas
            </th>
            <th scope="col" className="py-3 px-6">
              Jumlah Mahasiswa
            </th>
          </tr>
        </thead>
        <tbody>
          {jurusan?.map((j) => (
            <JurusanRow
              key={j.id}
              id={j.id}
              name={j.nama_jurusan}
              fakultas={j.fakultas.nama_fakultas}
              mahasiswa_count={j.mahasiswa.length}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JurusanPage;

interface AddModalProps {
  modalHidden: boolean;
  setModalHidden: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddModal = ({ modalHidden, setModalHidden }: AddModalProps) => {
  const utils = trpc.useContext();
  const [namaJurusan, setNamaJurusan] = useState("");
  const [namaFakultas, setNamaFakultas] = useState("");
  const [idFakultas, setIdFakultas] = useState("");

  const disabled = !Boolean(namaJurusan && idFakultas);
  const btn_save = disabled
    ? "w-full rounded-lg bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:w-auto"
    : "w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto";

  const postJurusan = trpc.jurusan.postJurusan.useMutation({
    onMutate: () => {
      utils.jurusan.getAll.cancel();
      const optimisticUpdate = utils.jurusan.getAll.getData();

      if (optimisticUpdate) {
        utils.jurusan.getAll.setData(undefined, [
          ...optimisticUpdate,
          {
            id: Math.random().toString(),
            nama_jurusan: namaJurusan,
            fakultas: {
              id: idFakultas,
              nama_fakultas: namaFakultas,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            mahasiswa: [],
          },
        ]);
      }
    },
    onSettled: () => {
      utils.jurusan.getAll.invalidate();
      setModalHidden(false);
    },
  });

  return (
    <div
      id="modal-container"
      aria-hidden="true"
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${
        modalHidden ? "flex" : "hidden"
      }`}
    >
      <div className="relative m-auto h-5/6 w-full bg-white shadow dark:bg-black sm:w-1/2 sm:rounded-lg">
        <div className="m-5 flex flex-col ">
          <div className="item-center mb-3 flex justify-between">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Tambahkan Jurusan
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
              postJurusan.mutate({
                name: String(namaJurusan),
                fakultasId: String(idFakultas),
              });
              setNamaJurusan("");
            }}
          >
            <div>
              <label
                htmlFor="nama_jurusan"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama
              </label>
              <input
                type={"text"}
                id="nama_jurusan"
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="nama jurusan"
                value={namaJurusan}
                onChange={(e) => setNamaJurusan(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="fakultas"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Fakultas
              </label>
              <select
                name="fakultas"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Pilih Fakultas"
                id="fakultas"
                required
                value={idFakultas + "," + namaFakultas}
                onChange={(e) => {
                  setIdFakultas(String(e.target.value.split(",")[0]));
                  setNamaFakultas(String(e.target.value.split(",")[1]));
                }}
              >
                <FakultasOptions />
              </select>
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

interface JurusanProps {
  id: string;
  name: string;
  fakultas: string;
  mahasiswa_count: number;
}
const JurusanRow = ({ id, name, fakultas, mahasiswa_count }: JurusanProps) => {
  return (
    <tr className="border-b ">
      <td className="py-4 px-6">{name}</td>
      <td className="py-4 px-6">{fakultas}</td>
      <td className="py-4 px-6">{mahasiswa_count}</td>
    </tr>
  );
};

const FakultasOptions = () => {
  const { data: fakultas, isLoading } = trpc.fakultas.getAll.useQuery();
  if (isLoading) return <option value="">Loading...</option>;
  return (
    <>
      <option value={""}>Pilih Fakultas</option>
      {fakultas?.map((f) => (
        <option key={f.id} value={f.id + "," + f.nama_fakultas}>
          {f.nama_fakultas}
        </option>
      ))}
    </>
  );
};
