import { UserCircle2 } from 'lucide-react';
import type { UserName } from '../types';

interface UserSelectionProps {
  onSelectUser: (user: UserName) => void;
}

const users = [
  { id: 'Hieu' as UserName, displayName: 'Hiếu', role: 'Chủ nhiệm', color: 'bg-blue-500' },
  { id: 'Ha' as UserName, displayName: 'Hà', role: 'Thành viên', color: 'bg-green-500' },
  { id: 'Dai' as UserName, displayName: 'Đài', role: 'Thành viên', color: 'bg-purple-500' }
];

export const UserSelection = ({ onSelectUser }: UserSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PSG Research
          </h1>
          <p className="text-gray-600">
            Panty & Stocking with Garterbelt Research Tool
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Internal Research Application
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Chọn người dùng để bắt đầu
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Choose user to start
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 hover:border-transparent hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className={`absolute inset-0 ${user.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative flex flex-col items-center space-y-3">
                <div className={`${user.color} rounded-full p-4 text-white`}>
                  <UserCircle2 size={40} />
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {user.displayName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user.role}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>No login required • Private access only</p>
        </div>
      </div>
    </div>
  );
};
