import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { tokenTransactionValidationSchema } from 'validationSchema/token-transactions';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.token_transaction
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTokenTransactionById();
    case 'PUT':
      return updateTokenTransactionById();
    case 'DELETE':
      return deleteTokenTransactionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTokenTransactionById() {
    const data = await prisma.token_transaction.findFirst(convertQueryToPrismaUtil(req.query, 'token_transaction'));
    return res.status(200).json(data);
  }

  async function updateTokenTransactionById() {
    await tokenTransactionValidationSchema.validate(req.body);
    const data = await prisma.token_transaction.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteTokenTransactionById() {
    const data = await prisma.token_transaction.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
