        } catch (error: any) {
    // CRITICAL: Refund credits if JAP fails
    // TODO: Implement refund logic here
    console.error('JAP Order Failed', error)
    return NextResponse.json({ error: 'Provider error. Please contact support.' }, { status: 502 })
}

// 4. Record Order in DB
const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
        user_id: user.id,
        service_id: serviceId,
        link,
        quantity,
        cost,
        jap_order_id: japOrder?.order,
        status: 'pending'
    })
    .select()
    .single()

if (orderError) {
    console.error('Failed to record order', orderError)
    // Order is placed at JAP but not in our DB. Critical log.
}

return NextResponse.json({ success: true, order })

    } catch (error: any) {
    console.error('Order processing error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
}
