'use client';

import { Question } from '@/types';
import { parseQAMarkdown } from '@/utils/parser';
import { useState } from 'react';

interface FileUploadProps {
	onQuestionsParsed: (questions: Question[]) => void;
}

export default function FileUpload({ onQuestionsParsed }: FileUploadProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>('');

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
			setError('يرجى رفع ملف .md صحيح');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const content = await file.text();
			const questions = parseQAMarkdown(content);

			if (questions.length === 0) {
				setError('لم يتم العثور على أسئلة في الملف');
				return;
			}

			onQuestionsParsed(questions);
		} catch (err) {
			setError('حدث خطأ في قراءة الملف');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full max-w-md mx-auto'>
			<div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors'>
				<input
					type='file'
					accept='.md,text/markdown'
					onChange={handleFileUpload}
					className='hidden'
					id='file-upload'
					disabled={isLoading}
				/>
				<label htmlFor='file-upload' className='cursor-pointer block'>
					<div className='text-gray-600'>
						{isLoading ? (
							<div className='flex items-center justify-center'>
								<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
								<span className='mr-2'>جاري المعالجة...</span>
							</div>
						) : (
							<>
								<div className='text-4xl mb-2'>📄</div>
								<div className='text-lg font-medium mb-2'>ارفع ملف qa.md</div>
								<div className='text-sm text-gray-500'>انقر هنا أو اسحب الملف إلى هنا</div>
							</>
						)}
					</div>
				</label>
			</div>

			{error && <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}
		</div>
	);
}
