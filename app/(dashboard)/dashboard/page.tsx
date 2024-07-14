import { GetFormStats, GetForms } from '@/actions/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode, Suspense } from 'react';
import { LuView } from 'react-icons/lu'
import { FaWpforms } from 'react-icons/fa'
import { HiCursorClick } from 'react-icons/hi'
import { TbArrowBounce } from 'react-icons/tb'
import { Separator } from '@/components/ui/separator';
import CreateFormBtn from '@/components/CreateFormBtn';
import { Form } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BiRightArrowAlt } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { getUser } from '@/lib/lucia';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUser();
  if(!user) {
    redirect('/auth');
  }

  return (
    <div className='container pt-4'>
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className='my-6' />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className='my-6' />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
        <Suspense fallback={[1,2,3,4].map(el => <FormCardSkeleton key={el} />)}>
          <FormCards />
        </Suspense>
      </div>
    </div>
  )
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />
}


interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}
function StatsCards(props: StatsCardsProps) {
  const { data, loading } = props;
  return (
    <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
      <StatsCard
        title="Totoal visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time form visits"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600" />

      <StatsCard
        title="Totoal submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time form submissions"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600" />

      <StatsCard
        title="Totoal rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visits that result in form submissions"
        value={data?.visits.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-blue-600" />

      <StatsCard
        title="Bounce rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visits that leave without interacting"
        value={data?.visits.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-blue-600" />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  icon: ReactNode;
  helperText: string;
  value: string;
  loading: boolean;
  className?: string;
}
export function StatsCard(props: StatsCardProps) {
  const { title, icon, helperText, value, loading, className } = props;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-around pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='text-2xl font-bold'>
          {!loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return (
    <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />
  );
}

async function FormCards() {
  const forms = await GetForms();

  return (
    <>
      {forms.map(form => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  )
}

function FormCard({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant={"destructive"}>Unpublished</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
          {form.published && <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No description"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/form/${form.id}`}>
              View submissions
              <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button asChild variant="secondary" className="w-full mt-2 text-md gap-4">
            <Link href={`/builder/${form.id}`}>
              Edit form
              <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}