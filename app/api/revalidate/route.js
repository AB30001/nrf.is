import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    if (!body?._id) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/sitemap.xml");

    if (body._type === "post" && body.slug?.current) {
      revalidatePath(`/post/${body.slug.current}`);
    }

    if (body._type === "category" && body.slug?.current) {
      revalidatePath(`/category/${body.slug.current}`);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      body
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
