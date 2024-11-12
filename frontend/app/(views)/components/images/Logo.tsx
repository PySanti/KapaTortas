import Image from 'next/image';

import logo from '@/public/images/Orange.png';

export default function Logo() {
  return <Image src={logo} alt='Logo' width={120} height={120} priority />;
}
