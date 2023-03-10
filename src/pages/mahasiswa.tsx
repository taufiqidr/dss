import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import Loading from "../../components/loading";
import { trpc } from "../utils/trpc";

const MahasiswaPage = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const { data: mahasiswa, isLoading } = trpc.mahasiswa.getAll.useQuery();

  const [idMahasiswa, setIdMahasiswa] = useState("");
  const [namaMahasiswa, setNamaMahasiswa] = useState("");
  const [nimMahasiswa, setNimMahasiswa] = useState("");

  const [idJurusan, setIdJurusan] = useState("");
  const [namaJurusan, setNamaJurusan] = useState("");
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
        id_mahasiswa={idMahasiswa}
        nama_mahasiswa={namaMahasiswa}
        nim_mahasiswa={nimMahasiswa}
        id_jurusan={idJurusan}
        nama_jurusan={namaJurusan}
        id_fakultas={idFakultas}
        nama_fakultas={namaFakultas}
      />
      <DeleteModal
        modalHidden={deleteModalVisible}
        setModalHidden={setDeleteModalVisible}
        id_mahasiswa={idMahasiswa}
      />
      <h1 className="text-4xl">Mahasiswa</h1>
      {isAdmin && (
        <div className="flex w-full justify-end">
          <button
            className="h-10 w-20 rounded-lg border p-1 font-bold"
            onClick={() => setAddModalVisible(true)}
          >
            Add
          </button>
        </div>
      )}
      <table className="mt-3 w-full border text-left">
        <thead className="border uppercase">
          <tr>
            <th scope="col" className="py-3 px-6">
              Nama Mahasiswa
            </th>
            <th scope="col" className="py-3 px-6">
              NIM
            </th>
            <th scope="col" className="py-3 px-6">
              Jurusan
            </th>
            <th scope="col" className="py-3 px-6">
              Fakultas
            </th>
            {isAdmin && (
              <th scope="col" className="py-3 px-6 text-center">
                Menu
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {mahasiswa?.map((m) => (
            <tr className="border-b " key={m.id}>
              <td className="py-4 px-6">{m.nama}</td>
              <td className="py-4 px-6">{m.nim}</td>
              <td className="py-4 px-6">{m.jurusan.nama_jurusan}</td>
              <td className="py-4 px-6">{m.fakultas.nama_fakultas}</td>
              {isAdmin && (
                <td className="flex justify-between py-4 px-6 text-center">
                  <BsTrashFill
                    role={"button"}
                    onClick={() => {
                      setDeleteModalVisible(true);
                      setIdMahasiswa(m.id);
                    }}
                  />{" "}
                  <BsPencilFill
                    role={"button"}
                    onClick={() => {
                      setUpdateModalVisible(true);

                      setIdMahasiswa(m.id);
                      setNamaMahasiswa(m.nama);
                      setNimMahasiswa(String(m.nim));

                      setIdJurusan(m.jurusan.id);
                      setNamaJurusan(m.jurusan.nama_jurusan);
                      setIdFakultas(m.fakultas.id);
                      setNamaFakultas(m.fakultas.nama_fakultas);
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

export default MahasiswaPage;

interface ModalProps {
  modalHidden: boolean;
  setModalHidden: React.Dispatch<React.SetStateAction<boolean>>;
  id_mahasiswa?: string;
  nama_mahasiswa?: string;
  nim_mahasiswa?: string;
  id_jurusan?: string;
  nama_jurusan?: string;
  id_fakultas?: string;
  nama_fakultas?: string;
}
const AddModal = ({ modalHidden, setModalHidden }: ModalProps) => {
  const utils = trpc.useContext();
  const [namaMahasiswa, setNamaMahasiswa] = useState("");
  const [nimMahasiswa, setNimMahasiswa] = useState("");
  const [namaJurusan, setNamaJurusan] = useState("");
  const [idJurusan, setIdJurusan] = useState("");
  const [namaFakultas, setNamaFakultas] = useState("");
  const [idFakultas, setIdFakultas] = useState("");

  const disabled = !Boolean(
    namaMahasiswa && nimMahasiswa && idFakultas && idJurusan
  );
  const btn_save = disabled
    ? "w-full rounded-lg bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:w-auto"
    : "w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto";
  const postMahasiswa = trpc.mahasiswa.postMahasiswa.useMutation({
    onMutate: () => {
      utils.mahasiswa.getAll.cancel();
      const optimisticUpdate = utils.mahasiswa.getAll.getData();

      if (optimisticUpdate) {
        utils.mahasiswa.getAll.setData(undefined, [
          {
            id: Math.random().toString(),
            nama: namaMahasiswa,
            nim: Number(nimMahasiswa),
            fakultas: {
              id: idFakultas,
              nama_fakultas: namaFakultas,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            jurusan: {
              id: idJurusan,
              nama_jurusan: namaJurusan,
              fakultasId: idFakultas,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          ...optimisticUpdate,
        ]);
      }
    },
    onSettled: () => {
      utils.mahasiswa.getAll.invalidate();
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
              Tambahkan Mahasiswa
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
              postMahasiswa.mutate({
                name: String(namaMahasiswa),
                nim: Number(nimMahasiswa),
                jurusanId: String(idJurusan),
                fakultasId: String(idFakultas),
              });
              setNamaMahasiswa("");
            }}
          >
            <div>
              <label
                htmlFor="nama_mahasiswa"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama
              </label>
              <input
                type={"text"}
                id="nama_mahasiswa"
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="nama mahasiswa"
                value={namaMahasiswa}
                onChange={(e) => setNamaMahasiswa(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="nim_mahasiswa"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                NIM
              </label>
              <input
                type="number"
                id="nim_mahasiswa"
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="NIM mahasiswa"
                value={nimMahasiswa}
                onChange={(e) => setNimMahasiswa(e.target.value)}
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
            {idFakultas && (
              <div>
                <label
                  htmlFor="jurusan"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Jurusan
                </label>
                <select
                  name="jurusan"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  id="jurusan"
                  required
                  value={idJurusan + "," + namaJurusan}
                  onChange={(e) => {
                    setIdJurusan(String(e.target.value.split(",")[0]));
                    setNamaJurusan(String(e.target.value.split(",")[1]));
                  }}
                >
                  <JurusanOptions fakultasId={idFakultas} />
                </select>
              </div>
            )}
            <button type="submit" className={btn_save} disabled={disabled}>
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
  id_mahasiswa,
  nama_mahasiswa,
  nim_mahasiswa,
  id_jurusan,
  nama_jurusan,
  id_fakultas,
  nama_fakultas,
}: ModalProps) => {
  useEffect(() => {
    setNamaMahasiswa(String(nama_mahasiswa));
    setNimMahasiswa(String(nim_mahasiswa));
    setIdJurusan(String(id_jurusan));
    setNamaJurusan(String(nama_jurusan));
    setIdFakultas(String(id_fakultas));
    setNamaFakultas(String(nama_fakultas));
  }, [
    nama_mahasiswa,
    nim_mahasiswa,
    id_jurusan,
    nama_jurusan,
    id_fakultas,
    nama_fakultas,
  ]);

  const utils = trpc.useContext();
  const [namaMahasiswa, setNamaMahasiswa] = useState("");
  const [nimMahasiswa, setNimMahasiswa] = useState("");

  const [idJurusan, setIdJurusan] = useState("");
  const [namaJurusan, setNamaJurusan] = useState("");
  const [idFakultas, setIdFakultas] = useState("");
  const [namaFakultas, setNamaFakultas] = useState("");
  const disabled = !Boolean(namaJurusan && idFakultas && namaFakultas);
  const btn_save = disabled
    ? "cursor-default w-full rounded-lg bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:w-auto"
    : "w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto";

  const updateMahasiswa = trpc.mahasiswa.updateMahasiswa.useMutation({
    onMutate: () => {
      utils.mahasiswa.getAll.cancel();
      const optimisticUpdate = utils.mahasiswa.getAll.getData();

      if (optimisticUpdate) {
        utils.mahasiswa.getAll.setData(
          undefined,
          optimisticUpdate.map((t) =>
            t.id === id_mahasiswa
              ? {
                  id: Math.random().toString(),
                  nama: namaMahasiswa,
                  nim: Number(nimMahasiswa),
                  fakultas: {
                    id: idFakultas,
                    nama_fakultas: namaFakultas,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                  jurusan: {
                    id: idJurusan,
                    nama_jurusan: namaJurusan,
                    fakultasId: idFakultas,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                }
              : t
          )
        );
      }
    },
    onSettled: () => {
      utils.mahasiswa.getAll.invalidate();
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
              Edit Mahasiswa
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
              updateMahasiswa.mutate({
                id: String(id_mahasiswa),
                name: String(namaMahasiswa),
                nim: Number(nimMahasiswa),
                jurusanId: String(idJurusan),
                fakultasId: String(idFakultas),
              });
              setNamaMahasiswa("");
            }}
          >
            <div>
              <label
                htmlFor="nama_mahasiswa"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama
              </label>
              <input
                type={"text"}
                id="nama_mahasiswa"
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="nama mahasiswa"
                value={namaMahasiswa}
                onChange={(e) => setNamaMahasiswa(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="nim_mahasiswa"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                NIM
              </label>
              <input
                type="number"
                id="nim_mahasiswa"
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="NIM mahasiswa"
                value={nimMahasiswa}
                onChange={(e) => setNimMahasiswa(e.target.value)}
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
            {idFakultas && (
              <div>
                <label
                  htmlFor="jurusan"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Jurusan
                </label>
                <select
                  name="jurusan"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  id="jurusan"
                  required
                  value={idJurusan + "," + namaJurusan}
                  onChange={(e) => {
                    setIdJurusan(String(e.target.value.split(",")[0]));
                    setNamaJurusan(String(e.target.value.split(",")[1]));
                  }}
                >
                  <JurusanOptions fakultasId={idFakultas} />
                </select>
              </div>
            )}
            <button type="submit" className={btn_save} disabled={disabled}>
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
  id_mahasiswa,
}: ModalProps) => {
  const utils = trpc.useContext();
  const deleteMahasiswa = trpc.mahasiswa.deleteMahasiswa.useMutation({
    onMutate: () => {
      utils.mahasiswa.getAll.cancel();
      const optimisticUpdate = utils.mahasiswa.getAll.getData();

      if (optimisticUpdate) {
        utils.mahasiswa.getAll.setData(
          undefined,
          optimisticUpdate.filter((f) => f.id != id_mahasiswa)
        );
      }
    },
    onSettled: () => {
      utils.mahasiswa.getAll.invalidate();
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
              Delete Mahasiswa
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
            <p>Apakah anda yakin akan menghapus mahasiswa ini?</p>
            <div className="flex gap-x-3">
              <button
                className="w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto"
                onClick={() => {
                  deleteMahasiswa.mutate({
                    id: String(id_mahasiswa),
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

interface JurusanOptionsProps {
  fakultasId: string;
}
const JurusanOptions = ({ fakultasId }: JurusanOptionsProps) => {
  const { data: jurusan, isLoading } = trpc.jurusan.getByFakultas.useQuery({
    fakultasId,
  });
  if (isLoading) return <option value="">Loading...</option>;
  return (
    <>
      <option value={""}>Pilih Jurusan</option>
      {jurusan?.map((f) => (
        <option key={f.id} value={f.id + "," + f.nama_jurusan}>
          {f.nama_jurusan}
        </option>
      ))}
    </>
  );
};
