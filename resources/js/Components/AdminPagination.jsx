import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminPagination({ links }) {
    // Nếu ít hơn 3 link (chỉ có prev, next và 1 trang) thì khỏi hiện
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-6 flex justify-center">
            <div className="flex gap-1 flex-wrap bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">
                {links.map((link, i) => {
                    // Xử lý nhãn hiển thị
                    let label = link.label;
                    if (label.includes('Previous')) label = '&laquo;';
                    else if (label.includes('Next')) label = '&raquo;';

                    return link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                                link.active
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                            }`}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    ) : (
                        <span
                            key={i}
                            className="w-9 h-9 flex items-center justify-center rounded-md text-sm text-gray-300 cursor-default"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}